import { Comment, List, Tooltip } from 'antd'
import React from 'react'
import './index.less'

const data = [
    {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
            <p>
                We supply a series of design principles, practical patterns and
                high quality design resources (Sketch and Axure), to help people
                create their product prototypes beautifully and efficiently.
            </p>
        ),
        datetime: (
            <Tooltip title="2016-11-22 11:22:33">
                <span>8 hours ago</span>
            </Tooltip>
        ),
    },
    {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
            <p>
                We supply a series of design principles, practical patterns and
                high quality design resources (Sketch and Axure), to help people
                create their product prototypes beautifully and efficiently.
            </p>
        ),
        datetime: (
            <Tooltip title="2016-11-22 10:22:33">
                <span>9 hours ago</span>
            </Tooltip>
        ),
    },
]

const Comments: React.FC = (props) => {
    const { data } = props
    return (
        <List
            className="comment-list"
            header={`${data.length} replies`}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
                <li>
                    <Comment
                        actions={item.actions}
                        author={item.author}
                        content={item.content}
                        datetime={item.datetime}
                    />
                </li>
            )}
        />
    )
}

export default Comments
