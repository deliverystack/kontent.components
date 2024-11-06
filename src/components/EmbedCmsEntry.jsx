const EmbedCmsEntry = ({ props }) => {
    return(
        <script
            dangerouslySetInnerHTML={{
                __html: `window.cmsEntry = "${props.props}";`
          }}
      />)
}

export default EmbedCmsEntry;