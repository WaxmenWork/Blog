import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Context } from '../..';
import { Pagination } from 'react-bootstrap';

const Pages = () => {

    const {blogStore} = useContext(Context)
    const pageCount = Math.ceil(blogStore.totalCount / blogStore.limit);
    const pages: number[] = [];

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }

    return (
        <Pagination className='mt-5'>
            {pages.map(page => 
                <Pagination.Item
                    key={page}
                    active={blogStore.page === page}
                    onClick={() => blogStore.setPage(page)}
                >
                    {page}
                </Pagination.Item>    
            )}
        </Pagination>
    )
}

export default observer(Pages);