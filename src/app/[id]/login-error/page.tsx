import { useRouter } from 'next/router';

const ErrorPage = () => {
    const router = useRouter();
    const { params } = router.query; // `params` will be an array of segments after `/[id]/login/error/`

    return (
        <div>
            <h1>Error Page</h1>
            <p>Here are the segments you requested:</p>
            <ul>
                {Array.isArray(params) ? (
                    params.map((segment, index) => (
                        <li key={index}>{decodeURIComponent(segment)}</li>
                    ))
                ) : (
                    <li>No segments found</li>
                )}
            </ul>
        </div>
    );
};

export default ErrorPage;
