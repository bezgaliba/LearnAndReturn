module.exports = class LMSService extends cds.ApplicationService {
    /**
     * Init
     */
    async init() {
        this.on('Test', async(req) => {
            debugger;
        })
        await super.init();
    }
};