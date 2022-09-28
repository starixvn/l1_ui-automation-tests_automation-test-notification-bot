import HookEventHandlerBase from "./hook-event-handler-base";

export default class MergeRequestEventHandler extends HookEventHandlerBase {
    constructor() {
        const hookEventName = "merge_request";
        super(hookEventName);
    }

    async buildAndFormatMessage(hookEvent) {
        const messageItems = [
            "\u{1F4E2} *Merge Request* \u{1F4E2}",
            `Project: [${hookEvent?.project?.name}](${hookEvent?.project?.web_url})`,
            `User: ${hookEvent?.user?.name}`,
            `Title: ${hookEvent?.object_attributes?.title}`,
            `Action: *${hookEvent?.object_attributes?.action}*`,
            `Branch: _${hookEvent?.object_attributes?.source_branch}_`,
            `For more detail, refer to [here](${hookEvent?.object_attributes?.url})`,
        ];

        return await Promise.resolve(messageItems.join("\n"));
    }
}
