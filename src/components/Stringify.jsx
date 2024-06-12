const Stringify = ({ props, title }) => {
    return (
        <>
            <strong>{title}</strong>
            <pre>{JSON.stringify(props, null, 2 )}</pre>
        </>
    )
}
  
export default Stringify;
