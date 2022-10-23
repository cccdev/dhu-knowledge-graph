import TopHeader from '@/components/TopHeader'
import { PointDetail } from '@/types'
import { request } from '@/utils/request'
import { Input, InputRef, Layout, message, Select, Tag, Tooltip, UploadFile, UploadProps } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import './index.less'
import { InboxOutlined, PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Form, Rate, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload'

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
    // console.log('Upload event:', e);
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

    // tag相关
    const [tags, setTags] = useState<string[]>([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef<InputRef>(null);
    const editInputRef = useRef<InputRef>(null);

    // useEffect(() => {
    //     if (inputVisible) {
    //         inputRef.current?.focus();
    //     }
    // }, [inputVisible]);

    // useEffect(() => {
    //     editInputRef.current?.focus();
    // }, [inputValue]);

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
    const fileUploadProps: UploadProps = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
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
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            message.success(res.msg)
            if (res.code === 0) {
                initData();
            }
        }).finally(() => {
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
    useEffect(() => {
        initData()
    }, [])
    return (
        <>
            <Layout className="layout">
                <Button onClick={() => { navigate(-1) }} id='back-btn' size="large" shape="circle" icon={<RollbackOutlined />} />
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
                        <Rate value={Number(data?.degree)} count={3}></Rate>
                        <span style={{ margin: '0 10px' }}>{rateDesc[Number(data.degree) - 1]}</span>
                        <embed src={data?.addressId} style={{ marginTop: '20px' }} />
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
                                            <p className="ant-upload-hint">支持doc,pdf,mp4,jpg,png等格式</p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                                    <Button type="primary" htmlType="submit" disabled={uploading}>
                                        {uploading ? '上传中' : '提交'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                )}
            </Layout>
        </>
    )
}

export default Detail
