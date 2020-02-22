import JiraTimeFormatter from "./JiraTimeService";
import JiraTimeService from "./JiraTimeService";

describe("JiraTimeFormatter", () => {
    describe("minutesToJiraFormat", () => {
        [
            {timeSpentInMinutes: 0, expectedJiraString: "0m"},
            {timeSpentInMinutes: 59, expectedJiraString: "59m"},
            {timeSpentInMinutes: 60, expectedJiraString: "1h"},
            {timeSpentInMinutes: 479, expectedJiraString: "7h 59m"},
            {timeSpentInMinutes: -479, expectedJiraString: "-7h 59m"},
        ].forEach(parameter => {
            it("should split transform " + parameter.timeSpentInMinutes + ' into the jira string "' + parameter.expectedJiraString + '"', () => {
                expect(JiraTimeFormatter.minutesToJiraFormat(parameter.timeSpentInMinutes)).toBe(parameter.expectedJiraString);
            });
        });
    });

    describe("isValidJiraFormat()", () => {
        [
            {input: "", isJiraFormat: true},
            {input: "  \t ", isJiraFormat: true},
            {input: " ", isJiraFormat: true},
            {input: "42", isJiraFormat: true},
            {input: " 42", isJiraFormat: true},
            {input: " 42 ", isJiraFormat: true},
            {input: "0", isJiraFormat: true},
            {input: "0000", isJiraFormat: true},
            {input: "1m", isJiraFormat: true},
            {input: "1h", isJiraFormat: true},
            {input: "1h 15", isJiraFormat: true},
            {input: "-1h 15", isJiraFormat: true},
            {input: "bla", isJiraFormat: false},
            {input: "bla", isJiraFormat: false},
            {input: "8823m", isJiraFormat: true},

        ].forEach(parameter => {
            it("should " + parameter.input + " be valid? ===" + parameter.isJiraFormat, () => {
                expect(JiraTimeFormatter.isValidJiraFormat(parameter.input))
                    .toBe(parameter.isJiraFormat);
            });
        });
    });

    describe("jiraFormatToMinutes()", () => {
        [
            {jiraString: "", expectedTimeSpentInMinutes: 0},
            {jiraString: "    ", expectedTimeSpentInMinutes: 0},
            {jiraString: "0", expectedTimeSpentInMinutes: 0},
            {jiraString: "42", expectedTimeSpentInMinutes: 42},
            {jiraString: "  42", expectedTimeSpentInMinutes: 42},
            {jiraString: "42  ", expectedTimeSpentInMinutes: 42},
            {jiraString: "0000", expectedTimeSpentInMinutes: 0},
            {jiraString: "   0000   ", expectedTimeSpentInMinutes: 0},
            {jiraString: "0m", expectedTimeSpentInMinutes: 0},
            {jiraString: "59m", expectedTimeSpentInMinutes: 59},
            {jiraString: "   59m   ", expectedTimeSpentInMinutes: 59},
            {jiraString: "1h", expectedTimeSpentInMinutes: 60},
            {jiraString: "1h 15", expectedTimeSpentInMinutes: 75},
            {jiraString: "-1h 15m", expectedTimeSpentInMinutes: -75},
            {jiraString: "-1h 15", expectedTimeSpentInMinutes: -75},
            {jiraString: "-1 15m", expectedTimeSpentInMinutes: -16},
            {jiraString: "-1 15", expectedTimeSpentInMinutes: -16},
            {jiraString: "15 1h", expectedTimeSpentInMinutes: 75},
            {jiraString: "1h 5m 2h", expectedTimeSpentInMinutes: 185},
            {jiraString: "7h 59m", expectedTimeSpentInMinutes: 479},
            {jiraString: "8h 5m", expectedTimeSpentInMinutes: 485},
        ].forEach(parameter => {
            it('should transform the jira String "' + parameter.jiraString + '" into its numeric value in minutes "' + parameter.expectedTimeSpentInMinutes + '"', () => {
                expect(JiraTimeFormatter.jiraFormatToMinutes(parameter.jiraString)).toBe(parameter.expectedTimeSpentInMinutes);
            });
        });

        it("should throw an appropriate error when the jira format to convert is not valid", () => {
            expect(() => JiraTimeService.jiraFormatToMinutes("25blubba")).toThrowError("'25blubba' is not a valid jira String");
        });
    });
});
