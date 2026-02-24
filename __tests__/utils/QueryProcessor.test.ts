import QueryProcessor from "../../utils/QueryProcessor";
import '@testing-library/jest-dom'

describe("QueryProcessor", () => {
    test("should return a string", () => {
        const query = "test";
        const response: string = QueryProcessor(query);
        expect(typeof response).toBe("string");
    });

    test('should return shakespeare description', () => {
        const query = "shakespeare";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
            "English poet, playwright, and actor, widely regarded as the greatest " +
            "writer in the English language and the world's pre-eminent dramatist."
          ));
    });

    test('should return name', () => {
        const query = "What is your name?";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "lleong"
          ));
    });

    test('should return Andrew ID', () => {
        const query = "What is your Andrew ID?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("My Andrew ID is: lleong");
    });

    test('should handle addition queries', () => {
        const query = "What is 59 plus 25?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("84");
    });

    test('should handle different addition queries', () => {
        expect(QueryProcessor("What is 10 plus 5?")).toBe("15");
        expect(QueryProcessor("What is 100 plus 200?")).toBe("300");
        expect(QueryProcessor("What is 7 plus 3?")).toBe("10");
    });
});