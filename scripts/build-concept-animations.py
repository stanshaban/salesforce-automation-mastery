"""Render labelled teaching diagrams. These are explanations, not org recordings."""
from PIL import Image, ImageDraw, ImageFont
import json, pathlib, textwrap, subprocess

ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'animations'; OUT.mkdir(exist_ok=True)
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
F=lambda n:ImageFont.truetype(FONT,n)
BG='#F7F4EE'; NAVY='#12253C'; BLUE='#3867E8'; TEAL='#138A86'
# Each stage states a specific mechanism and an observable outcome.
PROFILES=[
('access-layers','Object, field, and record access',['Object Read','Field readable','Record visible','Read result'],[
 ('Object Read is missing. Sharing a record cannot supply it.',0,'Object: denied | Record share: present | Result: denied'),
 ('Object Read exists, but the requested field is not readable.',1,'Object: allowed | Field: denied | Field value: withheld'),
 ('Object and field permissions exist; the individual record is not shared.',2,'Object: allowed | Field: allowed | Record: denied'),
 ('The required layers permit this read. Check the actual user and path.',3,'Object: allowed | Field: allowed | Record: visible')],['J11','J12','J15','J16','M01','M06']),
('muting','Muting affects one permission set group',['Set A: Read','Group + muting','Separate grant','Effective access'],[
 ('Set A grants Read through the group.',0,'Group contribution: Read'),
 ('Muting removes Read from this group contribution.',1,'Group contribution: no Read'),
 ('A separate assigned permission set still grants Read.',2,'Group: no Read | Separate set: Read'),
 ('Effective permissions include the separate grant.',3,'Result: Read remains | Muting is not a global deny')],['M02','S11']),
('sharing','Record access has independent granting paths',['Owner','Hierarchy','Explicit share','Visible record'],[
 ('The record owner has an identified access path.',0,'TD-A owner: Anna'),
 ('An appropriately configured role hierarchy may add manager access.',1,'Oleg: verify hierarchy and object settings'),
 ('One manual share can add access for a specific handover.',2,'Max: explicit share to TD-A'),
 ('Removing one grant may leave another path. Inspect the source.',3,'A custom lookup alone does not share its child records')],['J13','J14','M03','M04','S10']),
('restriction','A restriction rule filters an accessible set',['Granted records','Rule criteria','Matching subset','Actual query'],[
 ('Begin with a known set the user can otherwise access.',0,'Granted: A, B, C'),
 ('A supported restriction rule adds a filtering condition.',1,'Criteria: matches A and C'),
 ('The condition narrows access; it does not grant B to another user.',2,'Remaining subset: A, C'),
 ('Verify the actual user, object support, and access path.',3,'Compare expected and actual records')],['M05']),
('transaction','Commit and rollback',['Input change','Automation','Validation','Commit / rollback'],[
 ('A save starts work; an ID in memory is not proof of commit.',0,'Database before: original state'),
 ('Relevant Flow and trigger work runs within the transaction.',1,'Changes are pending'),
 ('A rejecting rule or controlled error can prevent the save.',2,'Outcome A: error → rollback'),
 ('A successful transaction commits. Async work has its own boundary.',3,'Outcome B: commit → durable state')],['J20','J21','M08','S01']),
('flow','Follow-up Task with an explicit failure route',['Test Drive created','Create Task','Fault / success','Stored outcome'],[
 ('The create-only record-triggered Flow starts for a new appointment.',0,'Source: one synthetic Test Drive'),
 ('Create the required follow-up Task.',1,'Task operation: attempted'),
 ('The designed Custom Error fault route rejects the source save.',2,'Failure route: reject, do not report silent success'),
 ('Inspect both the source and Task after a successful run.',3,'Success route: appointment + required Task')],['J17','M07']),
('component-events','Data down, events up',['Parent state','Child @api','User selection','CustomEvent'],[
 ('The parent owns the selected vehicle.',0,'Parent selection: none'),
 ('The child receives data through its public property.',1,'Input: vehicle list'),
 ('A click expresses an intended selection.',2,'Child action: choose NS-001'),
 ('An event informs the parent; the parent updates its state.',3,'Parent selection: NS-001')],['J23','J25','M23','M25']),
('lifecycle','One LWC instance through its lifetime',['constructor','connected','rendered','disconnected'],[
 ('An instance is created. Avoid assuming the DOM is available here.',0,'Instance: created'),
 ('Connection makes setup possible; reconnection can happen.',1,'Instance: connected'),
 ('Rendering can repeat. Avoid unconditional reactive writes here.',2,'Render count may be greater than one'),
 ('Release resources and subscriptions owned by the instance.',3,'Instance: removed | Cleanup: verified')],['M21']),
('queueable','Accepted work and its durable state',['Accept request','Queue worker','Process attempt','Persist outcome'],[
 ('Accept the request with a durable identity.',0,'Request: Pending'),
 ('Enqueue bounded work and record the observable job identity.',1,'Pending is not Succeeded'),
 ('The worker runs in a separate transaction.',2,'Request: Processing'),
 ('Persist success or an actionable failure; inspect the record.',3,'Request: Succeeded / Failed')],['M11','M12','M14','M30']),
('batch','Batch execute scopes are separate transactions',['start','execute A','execute B','finish'],[
 ('start determines the work to process.',0,'Work selected'),
 ('The first scope runs with its own transaction boundaries.',1,'Scope A: observe actual result'),
 ('Another scope is independent; do not assume all-or-nothing behavior.',2,'Scope B: may have a different outcome'),
 ('finish summarizes; reconcile successes and failures.',3,'Counts must match the work actually processed')],['M13']),
('callout','Classify a provider response before retrying',['Request contract','HTTP response','Parse + classify','Next action'],[
 ('Use a bounded contract and configured credential boundary.',0,'Operation identity: known'),
 ('A status code alone does not establish a valid business result.',1,'200 + malformed body can still be failure'),
 ('Separate success, permanent failure, transient failure, and unknown.',2,'Classification drives the next decision'),
 ('Retry only under the documented bounded policy, or reconcile.',3,'Unit mock evidence is not a live HTTP run')],['M15','M16','M17','M19','S19']),
('idempotency','A repeated request is not a second business operation',['Operation key','Existing receipt','Compare intent','Return / conflict'],[
 ('The first request establishes a durable business identity.',0,'Key K → Vehicle A'),
 ('The same key appears again in a separate request.',1,'Look up the original receipt'),
 ('Compare the intent, not only whether the key exists.',2,'Same intent / conflicting Vehicle B'),
 ('Return the existing outcome or a clear conflict.',3,'One intended effect; never silently change the original intent')],['M18','M27','S15']),
('refresh','A write and a refresh have different outcomes',['Read state','Write request','Commit result','Refresh UI'],[
 ('The interface displays a known read result.',0,'Displayed version: old'),
 ('An explicit user action starts a write.',1,'Write: in progress'),
 ('The write succeeds and the stored record changes.',2,'Stored version: new'),
 ('A failed refresh does not undo a successful write.',3,'Report refresh failure without inviting a duplicate write')],['J24','M22','M24']),
('events','Publication and subscriber work are separate',['Producer work','Commit gate','Event delivery','Subscriber effect'],[
 ('The producer prepares a business change.',0,'Producer transaction: open'),
 ('With publish-after-commit, rollback prevents this publication.',1,'Producer: commit / rollback'),
 ('Delivery has its own timing and can require duplicate handling.',2,'An accepted publish is not completed business processing'),
 ('The subscriber records its effect and recovery state.',3,'Verify subscriber outcome, not just producer acknowledgement')],['M26','M27']),
('retry','Bounded recovery during an outage',['Failed attempt','Backoff + jitter','Attempt budget','Reconcile / stop'],[
 ('An outage causes failures across many clients.',0,'Do not retry every client immediately'),
 ('Backoff and jitter spread eligible retries over time.',1,'Delay: bounded and varied'),
 ('A maximum attempt or time budget stops endless retrying.',2,'Budget remaining: decreases'),
 ('Unknown outcomes need reconciliation; exhausted work needs review.',3,'Recovery is observable and has an owner')],['S16']),
('release','Metadata and data changes have separate recovery work',['Compatible metadata','Deploy code','Backfill data','Verify + enable'],[
 ('Introduce a compatible schema before changing all consumers.',0,'Old and new behavior can coexist'),
 ('Deploy the next implementation with appropriate checks.',1,'Source version: recorded'),
 ('Backfill in bounded, reconcilable stages.',2,'Data change: independently observable'),
 ('Verify before enabling. Code rollback does not reverse all data.',3,'Recovery must cover metadata and data separately')],['M29','S18','S20']),
('agentforce','Read options, confirm, then verify the write',['Read demo catalog','Choose + confirm','Controlled Flow','Inspect CRM record'],[
 ('The catalog returns artificial options for an exact model.',0,'Read-only action | No booking created'),
 ('A write needs separate confirmation of the intended action.',1,'Declined confirmation → no write'),
 ('The Flow validates its inputs and protects the booking key.',2,'Created / existing result / explicit failure'),
 ('A real record and action trace establish the outcome.',3,'A confident chat reply alone is not proof')],['AF-04','AF-05','AF-06','AF-07','AF-08','AF-09','AF-10','M32','S22']),
('query','A useful filter preserves the user requirement',['User question','Data distribution','Query plan','Correct result'],[
 ('Define which upcoming appointments Anna needs.',0,'The requirement determines the result set'),
 ('A filter matching most records may not be selective.',1,'An index is not a promise of a fast query'),
 ('Inspect estimated cardinality and cost in this environment.',2,'Plan estimates are not elapsed milliseconds'),
 ('Verify correctness and measured behavior on comparable fixtures.',3,'A small org cannot establish enterprise throughput')],['S03','S05','S06','M20']),
]

def wrapped(d,text,xy,width,font,fill,spacing=8):
    # Width measured in pixels, keeping technical labels intact.
    x,y=xy;line=''
    for word in text.split():
        candidate=(line+' '+word).strip()
        if line and d.textlength(candidate,font=font)>width:
            d.text((x,y),line,font=font,fill=fill); y+=font.size+spacing;line=word
        else: line=candidate
    d.text((x,y),line,font=font,fill=fill)

manifest=[]
for key,title,nodes,stages,lessons in PROFILES:
    frames=[]
    for index,(caption,active,state) in enumerate(stages):
        im=Image.new('RGB',(1200,680),BG);d=ImageDraw.Draw(im)
        d.text((55,38),'SAM  /  CONCEPT WALKTHROUGH',font=F(16),fill=TEAL)
        wrapped(d,title,(55,75),1090,F(34),NAVY)
        d.text((55,142),'Teaching diagram · not a Salesforce screen recording',font=F(17),fill='#607080')
        for n,label in enumerate(nodes):
            x=55+n*283;y=225
            d.rounded_rectangle((x,y,x+240,y+120),18,fill=BLUE if n==active else '#FFFFFF',outline=BLUE if n==active else '#D8DDE5',width=2)
            wrapped(d,label,(x+17,y+30),205,F(23),'#FFFFFF' if n==active else NAVY,5)
            if n<3:
                d.line((x+247,y+60,x+275,y+60),fill=TEAL,width=3)
                d.polygon([(x+275,y+60),(x+266,y+54),(x+266,y+66)],fill=TEAL)
        d.rounded_rectangle((55,390,1145,470),14,fill='#E5EFEB')
        wrapped(d,state,(76,411),1040,F(22),NAVY)
        wrapped(d,caption,(55,510),1060,F(25),NAVY)
        for i in range(4):d.ellipse((55+i*24,625,65+i*24,635),fill=BLUE if i==index else '#CCD3DD')
        d.text((1090,620),f'{index+1} / 4',font=F(18),fill=TEAL)
        frames.append(im)
    frames[0].save(OUT/f'{key}.gif',save_all=True,append_images=frames[1:],duration=[2800]*4,loop=0,optimize=True,disposal=2)
    frames[0].save(OUT/f'{key}-poster.jpg',quality=90)
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/f'{key}.gif'),'-movflags','+faststart','-pix_fmt','yuv420p','-vf','fps=15',str(OUT/f'{key}.mp4')],check=True)
    manifest.append(dict(id=key,title=title,lessons=lessons,gif=f'/animations/{key}.gif',video=f'/animations/{key}.mp4',poster=f'/animations/{key}-poster.jpg',seconds=11.2,kind='teaching-diagram'))
(OUT/'index.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Rendered {len(manifest)} GIF/MP4 explanations for {len(set(x for m in manifest for x in m["lessons"]))} lessons.')
