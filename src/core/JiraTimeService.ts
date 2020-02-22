interface Unit {
    symbol: string;
    factor: number;
}

const jiraSymbolFactorMap: {
    [symbol: string]: Unit;
} = {};

const minute: Unit = jiraSymbolFactorMap.m = {symbol: "m", factor: 1};
const hour: Unit = jiraSymbolFactorMap.h = {symbol: "h", factor: 60 * minute.factor};

export default class JiraTimeService {
    public static minutesToJiraFormat(timeSpentInMinutes: number) {
        const absoluteTimeSpendInMinutes = Math.abs(timeSpentInMinutes);
        const resultString = `${JiraTimeService.hourPartOf(absoluteTimeSpendInMinutes)} ${JiraTimeService.minutePartOf(absoluteTimeSpendInMinutes)}`
            .replace(/\s+/, " ")
            .trim();
        return resultString === "" ?
            "0" + minute.symbol :
            timeSpentInMinutes < 0 ?
                "-" + resultString :
                resultString;
    }

    public static isValidJiraFormat(jiraString: string): boolean {
        const unitSymbols: string = Object.keys(jiraSymbolFactorMap).join();
        return new RegExp("^-?\\s*((\\d+[" + unitSymbols + "]?(\\s+\\d+[" + unitSymbols + "]?)*?)|(0+))?\\s*$").test(jiraString);
    }

    public static jiraFormatToMinutes(jiraString: string): number {
        if (!JiraTimeService.isValidJiraFormat(jiraString)) {
            throw new Error("'" + jiraString + "' is not a valid jira String");
        }

        const isNegative = jiraString.startsWith("-");
        return (isNegative ? jiraString.substr(1, jiraString.length) : jiraString).split(/\s+/)
            .map(JiraTimeService.toMinutes)
            .reduce(toSum) * (isNegative ? -1 : 1);
    }

    private static hoursOf(timeSpentInMinutes: number): number {
        return Math.floor((timeSpentInMinutes / hour.factor));
    }

    private static minutesOf(timeSpentInMinutes: number): number {
        return Math.floor((timeSpentInMinutes % hour.factor) / minute.factor);
    }

    private static minutePartOf(timeSpentInMinutes: number): string {
        return JiraTimeService.unitStringFor(JiraTimeService.minutesOf(timeSpentInMinutes), minute);
    }

    private static hourPartOf(timeSpentInMinutes: number): string {
        return JiraTimeService.unitStringFor(JiraTimeService.hoursOf(timeSpentInMinutes), hour);
    }

    private static unitStringFor(result: number, unit: Unit): string {
        return result === 0 ? "" : result + unit.symbol;
    }

    private static toMinutes(jiraStringPart: string): number {
        return jiraStringPart.trim().match(/^\d+$/) ?
            Number.parseInt(jiraStringPart) :
            Object.keys(jiraSymbolFactorMap)
                .map(key => jiraSymbolFactorMap[key])
                .map(unit => {
                    const match: RegExpMatchArray | null = jiraStringPart.match(new RegExp("(\\d+)" + unit.symbol, "g"));
                    return !match ?
                        0 :
                        match.map(m => Number.parseInt(m.replace(unit.symbol, ""), 0) * unit.factor)
                            .reduce(toSum);
                })
                .reduce(toSum);
    }
}

function toSum(v1: number, v2: number): number {
    return v1 + v2;
}
