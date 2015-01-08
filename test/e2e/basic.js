describe('test', function() {
    beforeEach(function() {
        browser.get('http://localhost:8001/');
    });
    
    it('loads the right page (dummy test)', function() {
        expect(browser.getTitle()).toEqual('Star Trek Roman Timeline');
    });
});