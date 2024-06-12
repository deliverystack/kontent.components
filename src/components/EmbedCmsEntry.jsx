const EmbedCmsEntry = ({ props }) => {
    return(
      <script
        dangerouslySetInnerHTML={{
          __html: `console.log("1"); window.cmsEntry = "${props}";`
        }}
      />)
}

export default EmbedCmsEntry;