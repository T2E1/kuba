import CodeBlock from '@theme/CodeBlock'
import styles from './styles.module.css'

// Renderiza um exemplo ao vivo mais a fonte colapsada — a mesma forma do
// antigo previewRenderer do Docsify, agora como componente MDX.
function Preview({ code }) {
  return (
    <div className={styles.preview}>
      <div
        className={styles.stage}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: code vem só das páginas de website/docs, escritas pelo próprio time — não é input de usuário.
        dangerouslySetInnerHTML={{ __html: code }}
      />
      <details className={styles.source}>
        <summary>Code</summary>
        <CodeBlock language="html">{code}</CodeBlock>
      </details>
    </div>
  )
}

export default Preview
