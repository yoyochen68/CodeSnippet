import { useRouter } from 'next/router';
import NewPostForm from '../components/NewPostForm';
import axios from 'axios';
import styled from 'styled-components';
import Head from 'next/head'

const AddPost = styled.div`
// display: flex;
font-size: 2rem;
width: 70vw;
justify-content: center;
align-items: center;
margin: 10% 10%;
`

export default function Profile({ post }) {
    const router = useRouter()

    const handleSubmmit = async ({ language, code }) => {
        await axios.post('/api/posts', {
            language,
            code,
        }).then(res => {
            router.push(`/code/${res.data.id}`)
        })
        
    }

    return (
    <div className="m-20">
             
            <h1>Create a Snippet</h1>
        

                <NewPostForm onSubmit={handleSubmmit} />

           
        </div >
    )
}