import Image from 'next/image';
import Logo from './images/LOGO.png';

export default function Home() {
    return (
        <div className="w-screen">
            <header className="h-20 w-screen bg-header">
                <Image src={Logo} alt='Suhas Koheda' className='h-20 w-auto pl-4 pb-1'/>
            </header>
            <div className="flex flex-col items-center">
                <div className="grid cols-1 md:flex md:justify-around ">
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 w-min m-4">
                        <h4><a href="/Dean">Dean</a></h4>
                    </div>
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 w-min m-4">
                        <h4><a href="/Hod">HOD</a></h4>
                    </div>
                </div>
                <div className="grid cols-1 md:flex md:justify-around ">
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 w-min m-4">
                        <h4><a href="/Faculty">Faculty</a></h4>
                    </div>
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 w-min m-4">
                        <h4><a href="/Student">Student</a></h4>
                    </div>
                </div>
            </div>
        </div>
    );
}