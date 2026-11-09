/**
 * Training-only slot catalog. No external calendar is contacted.
 * The booking Flow must validate/claim the selected slot independently.
 */
public with sharing class SAMDemoSlotCatalog {
    @TestVisible private static Date fixedDay;

    public class Request {
        @InvocableVariable(label='Vehicle model' description='Exact model value, for example City EV. Ask the employee if it is missing.' required=true)
        public String model;
    }

    public class Response {
        @InvocableVariable(label='Result code' description='OK, INVALID_INPUT, NOT_FOUND, AMBIGUOUS, or UNAVAILABLE.')
        public String resultCode;
        @InvocableVariable(label='Message' description='Plain explanation. These are demonstration slots, not a live calendar.')
        public String message;
        @InvocableVariable(label='Vehicle ID' description='ID of the single matching readable Vehicle record.')
        public Id vehicleId;
        @InvocableVariable(label='Vehicle name' description='Name of the resolved demonstration vehicle.')
        public String vehicleName;
        @InvocableVariable(label='First slot key' description='Opaque key for the first demonstration slot. Pass this exact value to the booking Flow.')
        public String slotOneKey;
        @InvocableVariable(label='First slot start' description='First demonstration slot, 10:00 UTC on the next day.')
        public Datetime slotOneStart;
        @InvocableVariable(label='Second slot key' description='Opaque key for the second demonstration slot. Pass this exact value to the booking Flow.')
        public String slotTwoKey;
        @InvocableVariable(label='Second slot start' description='Second demonstration slot, 14:00 UTC on the next day.')
        public Datetime slotTwoStart;
    }

    @InvocableMethod(label='SAM Demo Slot Catalog' description='Reads one visible vehicle by exact model and returns two mock time slots for tomorrow. Does not reserve anything or contact a real calendar.')
    public static List<Response> lookup(List<Request> requests) {
        List<Response> results = new List<Response>();
        if (requests == null) return results;

        Set<String> models = new Set<String>();
        for (Request request : requests) {
            if (request != null && !String.isBlank(request.model)) {
                models.add(request.model.trim());
            }
        }
        Map<String, List<Vehicle__c>> byModel = new Map<String, List<Vehicle__c>>();
        if (!models.isEmpty()) {
            for (Vehicle__c vehicle : [
                SELECT Id, Name, Model__c, Status__c
                FROM Vehicle__c
                WHERE Model__c IN :models
                WITH USER_MODE
            ]) {
                String key = vehicle.Model__c.toLowerCase();
                if (!byModel.containsKey(key)) byModel.put(key, new List<Vehicle__c>());
                byModel.get(key).add(vehicle);
            }
        }
        Date day = fixedDay == null ? Date.today().addDays(1) : fixedDay;
        Datetime firstStart = Datetime.newInstanceGmt(day, Time.newInstance(10, 0, 0, 0));
        Datetime secondStart = Datetime.newInstanceGmt(day, Time.newInstance(14, 0, 0, 0));

        for (Request request : requests) {
            Response result = new Response();
            if (request == null || String.isBlank(request.model)) {
                result.resultCode = 'INVALID_INPUT';
                result.message = 'Specify an exact vehicle model.';
            } else {
                List<Vehicle__c> matches = byModel.get(request.model.trim().toLowerCase());
                if (matches == null || matches.isEmpty()) {
                    result.resultCode = 'NOT_FOUND';
                    result.message = 'No visible vehicle matches that model.';
                } else if (matches.size() != 1) {
                    result.resultCode = 'AMBIGUOUS';
                    result.message = 'More than one visible vehicle matches. Ask the demo administrator to make the model unique.';
                } else if (matches[0].Status__c != 'Available') {
                    result.resultCode = 'UNAVAILABLE';
                    result.message = 'The vehicle is not available in the demonstration catalog.';
                } else {
                    Vehicle__c vehicle = matches[0];
                    result.resultCode = 'OK';
                    result.vehicleId = vehicle.Id;
                    result.vehicleName = vehicle.Name;
                    result.slotOneStart = firstStart;
                    result.slotTwoStart = secondStart;
                    result.slotOneKey = String.valueOf(vehicle.Id) + ':' + firstStart.formatGmt('yyyyMMddHHmm');
                    result.slotTwoKey = String.valueOf(vehicle.Id) + ':' + secondStart.formatGmt('yyyyMMddHHmm');
                    result.message = 'Demo slots only: tomorrow at 10:00 or 14:00 UTC, 30 minutes. A slot is reserved only after the booking Flow succeeds.';
                }
            }
            results.add(result);
        }
        return results;
    }
}
