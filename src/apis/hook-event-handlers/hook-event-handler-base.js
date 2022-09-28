export default class HookEventHandlerBase {
    constructor(eventType) {
        this.eventType = eventType;
    }

    handleEvent(hookEvent) {
        return hookEvent?.event_type == this.eventType || hookEvent?.object_kind == this.eventType;
    }

    async buildAndFormatMessage(hookEvent) {}
}
