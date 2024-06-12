const EmbedCmsEntry = ({ props }) => {
    return(
        <script
            dangerouslySetInnerHTML={{
                __html: `window.cmsEntry = "${props}";`
          }}
      />)
}

export default EmbedCmsEntry;