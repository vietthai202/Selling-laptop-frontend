
import { Outlet } from 'react-router-dom';

import HeaderMain from '../components/Header';
import { useEffect, useState } from 'react';
import { getAllMenu } from '../services/menu';
import { IMenu, ISubMenu } from '../types/menu';
import ShowIcon from '../components/ShowIcon';

const MainLayout = () => {

    const [menus, setMenus] = useState<IMenu[]>([]);

    useEffect(() => {
        getAllMenu("FOOTER").then((data: IMenu[]) => {
            if (data.length > 0) {
                setMenus(data);
            }
        })
    }, []);

    return (
        <>
            <div>
                <HeaderMain />
                <div className='block p-5 body'>
                    <Outlet />
                </div>
            </div>

            <div className="bg-white w-full p-10 text-center md:text-left">
                <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {
                        menus.map((menu: IMenu) => (
                            <>
                                {
                                    menu.enable &&
                                    <div key={menu.id} className="">
                                        <div className="mb-4 flex justify-center items-center font-semibold uppercase md:justify-start">
                                            {menu.name}
                                        </div>
                                        {
                                            menu.uiSubmenus.map((sub: ISubMenu) => (
                                                <>
                                                    {
                                                        sub.enable &&
                                                        <div key={sub.id} className="mb-4 flex space-x-2">
                                                            {sub.icon && sub.icon !== "FcAddImage" && <ShowIcon size={18} name={sub.icon} />}
                                                            {
                                                                sub.url ?
                                                                    <a href={sub.url} className="text-blue-500 no-underline">{sub.name}</a>
                                                                    :
                                                                    <div className="text-black">{sub.name}</div>
                                                            }
                                                        </div>
                                                    }
                                                </>
                                            ))
                                        }
                                    </div>
                                }
                            </>
                        ))
                    }
                </div>
            </div>


            <div className='h-[40px] bg-[#6d6d6d] text-white flex items-center justify-center'>
                © 2023. All rights reserved.
            </div>
        </>
    )
}

export default MainLayout;