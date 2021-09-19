import React from "react"
import ContentLoader from "react-content-loader"

const ChatItemLoader = () => (
    <ContentLoader
        speed={2}
        width={400}
        height={70}
        viewBox="0 0 400 65"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"

    >
        <rect x="80" y="40" rx="3" ry="3" width="120" height="10" />
        <circle cx="41" cy="34" r="29" />
        <rect x="80" y="18" rx="3" ry="3" width="84" height="10" />
    </ContentLoader>
)

export default ChatItemLoader