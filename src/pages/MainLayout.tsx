
import { Outlet } from 'react-router-dom';

import HeaderMain from '../components/Header';

const MainLayout = () => {
    return (
        <>
            <div>
                <HeaderMain />
                <div className='block p-5 body'>
                    <Outlet />
                </div>
            </div>
            <div className='h-[40px] bg-[#6d6d6d] text-white flex items-center justify-center'>
                © 2023. All rights reserved.
            </div>
        </>
    )
}

export default MainLayout;