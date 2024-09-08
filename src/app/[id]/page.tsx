

export default function Page({ params }: { params: { id: string } }) {
        return (
            <div className="text-3xl text-center">
                <h4>I am at {params.id} page</h4>
            </div>
        )
}