import HookEventHandlerBase from "./hook-event-handler-base";

export default class NoteEventHandler extends HookEventHandlerBase {
    constructor() {
        const hookEventName = "note";
        super(hookEventName);
    }

    async buildAndFormatMessage(hookEvent) {
        const messageItems = [
            "\u{1F4AC} *Merge Request Discussion* \u{1F4AC}",
            `Project: [${hookEvent?.project?.name}](${hookEvent?.project?.web_url})`,
            `User: ${hookEvent?.user?.name}`,
            `Merge Request: ${hookEvent?.merge_request?.title}`,
            `Branch: _${hookEvent?.merge_request?.source_branch}_`,
            `Comment: ${hookEvent?.object_attributes?.note}`,
            `For more detail, refer to [here](${hookEvent?.object_attributes?.url})`,
        ];

        return await Promise.resolve(messageItems.join("\n"));
    }
}
