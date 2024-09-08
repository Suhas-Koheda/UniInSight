import Image from 'next/image';
import Logo from './images/LOGO.png';

export default function Home() {
    return (
        <div className="w-auto">
            <div className="flex flex-col items-center w-auto">
                <div className="grid cols-1 md:flex md:justify-around ">
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 m-4 shadow-inner">
                        <h4><a href="/Dean/login">Dean</a></h4>
                    </div>
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 m-4 shadow-inner">
                        <h4><a href="/Hod/login">HOD</a></h4>
                    </div>
                </div>
                <div className="grid cols-1 md:flex md:justify-around ">
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 m-4 shadow-inner">
                        <h4><a href="/Faculty/login">Faculty</a></h4>
                    </div>
                    <div className="p-14 text-center md:p-24 bg-button-bg rounded-3xl md:m-4 m-4 shadow-inner">
                        <h4><a href="/Student/login">Student</a></h4>
                    </div>
                </div>
            </div>
        </div>
    );
}