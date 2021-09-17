type IMessage = {
    message: string,
    timestamp: string,
    users: string,
    sender: string,
    user: object & {
        name: string
    }
}
export default IMessage