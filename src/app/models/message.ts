export interface Message {
    // from: string;
    // to?: string;
    content: string;
    senderEmail :string;
    receiverEmail:string;
    dateTime:Date;
    messageId?:string;
}