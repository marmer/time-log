export interface TimeLog {
    durationInMinutes: number;
    description: string;
}

export default class TimeLogService {
    public static async getTimeLogsForDay(_: Date): Promise<TimeLog[]> {
        // TODO: marmer 04.02.2020 Do not just return mocked data
        return new Promise(resolve => setTimeout(() => resolve([{
            description: "mock description",
            durationInMinutes: 42
        }, {
            description: "another mock description",
            durationInMinutes: 1337
        }]), 750))
    }

}
