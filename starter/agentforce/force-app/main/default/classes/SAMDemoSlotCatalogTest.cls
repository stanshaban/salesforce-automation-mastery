@IsTest
private class SAMDemoSlotCatalogTest {
    private static SAMDemoSlotCatalog.Request requestFor(String model) {
        SAMDemoSlotCatalog.Request request = new SAMDemoSlotCatalog.Request();
        request.model = model;
        return request;
    }

    @TestSetup
    static void createVehicles() {
        insert as system new List<Vehicle__c>{
            new Vehicle__c(Name='NS-001', VIN__c='SAM00000000000001', Model__c='City EV', Status__c='Available'),
            new Vehicle__c(Name='NS-002', VIN__c='SAM00000000000002', Model__c='Tourer Hybrid', Status__c='Unavailable'),
            new Vehicle__c(Name='NS-003', VIN__c='SAM00000000000003', Model__c='Duplicate Model', Status__c='Available'),
            new Vehicle__c(Name='NS-004', VIN__c='SAM00000000000004', Model__c='Duplicate Model', Status__c='Available')
        };
    }

    @IsTest
    static void returnsTwoDeterministicSlotsWithoutWriting() {
        SAMDemoSlotCatalog.fixedDay = Date.newInstance(2030, 1, 15);
        Integer dmlBefore = Limits.getDmlStatements();
        List<SAMDemoSlotCatalog.Response> results = SAMDemoSlotCatalog.lookup(
            new List<SAMDemoSlotCatalog.Request>{requestFor('City EV')}
        );
        System.assertEquals(1, results.size());
        System.assertEquals('OK', results[0].resultCode);
        System.assertNotEquals(null, results[0].vehicleId);
        System.assertEquals(Datetime.newInstanceGmt(2030, 1, 15, 10, 0, 0), results[0].slotOneStart);
        System.assertEquals(Datetime.newInstanceGmt(2030, 1, 15, 14, 0, 0), results[0].slotTwoStart);
        System.assertNotEquals(results[0].slotOneKey, results[0].slotTwoKey);
        System.assertEquals(dmlBefore, Limits.getDmlStatements(), 'Catalog must not write records.');
    }

    @IsTest
    static void handlesInvalidMissingUnavailableAndAmbiguousModels() {
        List<SAMDemoSlotCatalog.Response> results = SAMDemoSlotCatalog.lookup(
            new List<SAMDemoSlotCatalog.Request>{
                requestFor(' '), requestFor('Unknown'), requestFor('Tourer Hybrid'),
                requestFor('Duplicate Model'), null
            }
        );
        System.assertEquals(5, results.size());
        System.assertEquals('INVALID_INPUT', results[0].resultCode);
        System.assertEquals('NOT_FOUND', results[1].resultCode);
        System.assertEquals('UNAVAILABLE', results[2].resultCode);
        System.assertEquals('AMBIGUOUS', results[3].resultCode);
        System.assertEquals('INVALID_INPUT', results[4].resultCode);
        System.assertEquals(null, results[2].slotOneKey);
    }

    @IsTest
    static void bulkRequestsUseOneQueryAndPreserveOrder() {
        List<SAMDemoSlotCatalog.Request> requests = new List<SAMDemoSlotCatalog.Request>();
        for (Integer i = 0; i < 200; i++) requests.add(requestFor('City EV'));
        Integer queriesBefore = Limits.getQueries();
        List<SAMDemoSlotCatalog.Response> results = SAMDemoSlotCatalog.lookup(requests);
        System.assertEquals(200, results.size());
        System.assertEquals(1, Limits.getQueries() - queriesBefore);
        for (SAMDemoSlotCatalog.Response result : results) System.assertEquals('OK', result.resultCode);
    }

    @IsTest
    static void emptyInputIsEmptyOutput() {
        System.assertEquals(0, SAMDemoSlotCatalog.lookup(null).size());
        System.assertEquals(0, SAMDemoSlotCatalog.lookup(new List<SAMDemoSlotCatalog.Request>()).size());
    }
}
