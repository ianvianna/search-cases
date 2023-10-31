public class SearchCasesController {
    
    @AuraEnabled
    public static Case getCaseDetails(String caseDetail, String searchType) {
        String query = 'SELECT Id, CaseNumber, Status FROM Case WHERE ' + searchType + ' = \'' + caseDetail + '\' LIMIT 1';
        
        Case caseFound = (Case) Database.query(query);
        
        System.debug('ABC: ' + caseFound);
        return caseFound;
    }
    
}