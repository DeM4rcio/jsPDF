describe("Text Field Value Collector", function() {
    let textField;

    function createTextField(id) {
        const input = document.createElement('input');
        input.id = id;
        input.type = 'text';
        document.body.appendChild(input);
        return input;
    }

    beforeEach(function() {
       
        textField = createTextField('textarea');
    });

    afterEach(function() {
       
        document.body.removeChild(textField);
    });

    it("should return a value greater than zero after filling the text field", function() {
        
        textField.value = 'Hello World';

        
        const value = getTextFieldValue('textarea');

       
        expect(value.length).toBeGreaterThan(0);
    });
});
