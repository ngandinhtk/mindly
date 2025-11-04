class MindlyController {
    public getWelcomeMessage(req, res) {
        res.json({ message: "Welcome to Mindly!" });
    }
}

export default new MindlyController();