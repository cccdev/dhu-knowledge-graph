import TopHeader from '@/components/TopHeader'
import { PointDetail } from '@/types'
import { request } from '@/utils/request'
import { Input, InputRef, Layout, message, Select, Tag, Tooltip, UploadFile, UploadProps } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './index.less'
import { DownloadOutlined, FullscreenOutlined, InboxOutlined, PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Form, Rate, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload'
import { useAtom } from 'jotai'
import { userDataAtom } from '@/App'
import Comments from '@/components/Comments'

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

// 难度等级描述
const rateDesc = ['初级', '中级', '高级'];
const Detail: React.FC = (props) => {
    const navigate = useNavigate();
    const [params] = useSearchParams()
    const [pointId] = useState(params.getAll('id')[0])
    const [data, setData] = useState<PointDetail | null>(null)
    const fileRef = useRef();
    const initData = () => {
        request<PointDetail | null>({
            url: '/home/detail',
            params: {
                pointId,
            },
        }).then((res) => {
            if (res.code === 0) {
                // message.success(res.msg)
                // console.log(res.data)
                setData(res.data)
            } else {
                // message.error(res.msg);
            }
        })
    }
    // const initComments = () => {
    //     request({
    //         url: '/comment/detail',
    //         params: {
    //             pointId,
    //         },
    //     }).then((res) => {
    //         if (res.code === 0) {
    //             // message.success(res.msg)
    //             // console.log(res.data)
    //             setData(res.data)
    //         } else {
    //             // message.error(res.msg);
    //         }
    //     })
    // }
    const [userData] = useAtom(userDataAtom)
    useEffect(() => {
        if (!userData.isLoggedIn) {
            navigate('/login')
            return
        }
    }, [])

    // tag相关
    const [tags, setTags] = useState<string[]>([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef<InputRef>(null);
    const editInputRef = useRef<InputRef>(null);

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter(tag => tag !== removedTag);
        // console.log(newTags);
        setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        setEditInputIndex(-1);
        setInputValue('');
    };

    // 手动上传文件
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const fileUploadProps: UploadProps = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            // 限制50M
            if (file.size > 50 * 1024 * 1024) {
                message.warn('文件大小不能超过50M')
                return Upload.LIST_IGNORE;
            }
            const fileTypeArr = file.name.split('.');
            const fileType = fileTypeArr[fileTypeArr.length - 1].toLowerCase();
            // 限制格式
            if (!['pdf', 'png', 'jpg', 'gif', 'jpeg', 'mp4', 'wav'].includes(fileType)) {
                message.warn('不支持.' + fileType + '格式的文件')
                setFileList([])
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        fileList,
    };
    // oss上传
    const upload = (data: FormData) => {
        setUploading(true);
        request({
            url: '/oss/upload',
            method: 'post',
            data,
            timeout: 60000,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (e: ProgressEvent) => {
                console.log(progressValue)
                setProgressValue(~~((e.loaded / e.total) * 100));
            },
        }).then(res => {
            message.success(res.msg)
            if (res.code === 0) {
                initData();
            }
        }).catch(res => {
            message.error('上传超时（60s）')
        })
            .finally(() => {
                setUploading(false);
            });
    }
    const onFinish = (values: any) => {
        if (fileList.length === 0) {
            message.warning('文件是必选项');
            return;
        }
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('multipartFile', file as RcFile);
        });
        formData.append('pointId', pointId)
        formData.append('tag', '#' + tags.join('#'))
        formData.append('degree', values.degree + '')
        formData.append('content', values.content)

        upload(formData)
    };
    const download = () => {
        request({
            url: '/oss/getDownloadUrl',
            params: {
                fileUrl: data?.addressId
            }
        }).then(res => {
            if (res.code === 0) {
                window.open(res.data)
            } else {
                message.error(res.msg)
            }
        })
    }
    useEffect(() => {
        initData()
    }, [])
    return (
        <>
            <Layout className="layout">
                {/* <Button onClick={() => { navigate(-1) }} id='back-btn' size="large" shape="circle" icon={<RollbackOutlined />} /> */}
                <TopHeader />
                {data ? (
                    <div id="detail">
                        <h1>{data.pointName}</h1>
                        <div className="tags">
                            {data.tag
                                .split('#')
                                .filter((e) => e !== '')
                                .map((e, index) => (
                                    <Tag key={index} color="#f50">
                                        {e}
                                    </Tag>
                                ))}
                        </div>
                        <h3>类型：{data?.content}</h3>
                        <h3 style={{ display: 'inline' }}>难度：</h3>
                        <Rate disabled value={Number(data?.degree)} count={3}></Rate>
                        <span style={{ margin: '0 10px' }}>{rateDesc[Number(data.degree) - 1]}</span>
                        <Button className='file-btn' onClick={download} icon={<DownloadOutlined />}>
                            下载
                        </Button>
                        <Button className='file-btn' onClick={() => {
                            try {
                                fileRef.current.requestFullscreen()
                            } catch {
                                message.error('操作失败')
                            }
                        }} icon={<FullscreenOutlined />}>
                            全屏
                        </Button>
                        <embed allowfullscreen ref={fileRef} src={data?.addressId} style={{ marginTop: '20px' }} />
                    </div>
                ) : (
                    <div className="no-detail">
                        <h1>该结点没有任何信息，请在下方添加信息并提交</h1>
                        <div id="upload-form">
                            <Form
                                name="validate_other"
                                {...formItemLayout}
                                onFinish={onFinish}
                                initialValues={{
                                    'input-number': 3,
                                    'checkbox-group': ['A', 'B'],
                                    rate: 3.5,
                                }}
                            >
                                <Form.Item
                                    name="content"
                                    label="分类"
                                    rules={[{ required: true, message: '标题不可为空' }]}
                                >
                                    <Select style={{ width: '100px' }}>
                                        <Select.Option value="原理">原理</Select.Option>
                                        <Select.Option value="实验">实验</Select.Option>
                                        <Select.Option value="题库">题库</Select.Option>
                                        <Select.Option value="问答">问答</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="degree"
                                    label="难度"
                                    rules={[{ required: true }]}
                                >
                                    <Rate tooltips={rateDesc} count={3} />
                                </Form.Item>

                                <Form.Item label="标签">
                                    <span className="tags">
                                        {tags.map((tag, index) => {
                                            if (editInputIndex === index) {
                                                return (
                                                    <Input
                                                        ref={editInputRef}
                                                        key={tag}
                                                        size="small"
                                                        className="tag-input"
                                                        value={editInputValue}
                                                        onChange={handleEditInputChange}
                                                        onBlur={handleEditInputConfirm}
                                                        onPressEnter={handleEditInputConfirm}
                                                    />
                                                );
                                            }

                                            const isLongTag = tag.length > 20;

                                            const tagElem = (
                                                <Tag
                                                    className="edit-tag"
                                                    key={tag}
                                                    closable={true}
                                                    onClose={() => handleClose(tag)}
                                                >
                                                    <span
                                                        onDoubleClick={e => {
                                                            if (index !== 0) {
                                                                setEditInputIndex(index);
                                                                setEditInputValue(tag);
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                    </span>
                                                </Tag>
                                            );
                                            return isLongTag ? (
                                                <Tooltip title={tag} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })}
                                        {inputVisible && (
                                            <Input
                                                ref={inputRef}
                                                type="text"
                                                size="small"
                                                className="tag-input"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                onBlur={handleInputConfirm}
                                                onPressEnter={handleInputConfirm}
                                            />
                                        )}
                                        {!inputVisible && (
                                            <Tag className="site-tag-plus" onClick={showInput}>
                                                <PlusOutlined /> 添加标签
                                            </Tag>
                                        )}
                                    </span>
                                </Form.Item>

                                <Form.Item label="附件" required>
                                    <Form.Item name="multipartFile" valuePropName="fileList" getValueFromEvent={normFile} noStyle >
                                        <Upload.Dragger name="files" maxCount={1} {...fileUploadProps}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">点击或拖拽至此进行上传</p>
                                            <p className="ant-upload-hint">仅支持pdf, png, jpg, gif, jpeg, mp4, wav格式</p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                                    <Button id='upload-btn' type="primary" htmlType="submit" disabled={uploading}>
                                        {
                                            uploading
                                                ? (
                                                    progressValue < 100
                                                        ? '上传中' + progressValue + '%'
                                                        : '上传完毕，处理中')
                                                : '提交'
                                        }
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                )
                }
                {/* <Comments data={commentsData}></Comments> */}
            </Layout >
        </>
    )
}

export default Detail
