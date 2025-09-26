// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [url, setUrl] = useState('');
  const [produto, setProduto] = useState({
    id: '',
    nome: '',
    slug: '',
    descricao: '',
    categoria: '',
    idade: '',
    genero: '',
    imagem: '',
    linkAfiliado: ''
  });
  const [produtos, setProdutos] = useState([]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const extrairInfo = async () => {
    try {
      const response = await axios.get(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');

      const nome = (doc.querySelector('h1') as HTMLElement)?.innerText || '';

      let imagem = doc.querySelector('img[itemprop="image"]')?.getAttribute('src');
      if (!imagem) imagem = doc.querySelector('.ui-pdp-gallery__figure img')?.getAttribute('src');
      if (!imagem) imagem = (doc.querySelector('meta[property="og:image"]') as HTMLMetaElement)?.content || '';

      const descricaoElement = doc.querySelector('p[data-testid="content"]') as HTMLElement;
      const descricao = descricaoElement ? descricaoElement.innerText.replace(/\n/g, '\n') :
                        (doc.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || '';

      const categoria = (doc.querySelector('nav.breadcrumb a:last-child') as HTMLElement)?.innerText || '';

      setProduto({
        ...produto,
        nome,
        slug: nome.toLowerCase().replace(/\s+/g, '-'),
        descricao,
        imagem,
        linkAfiliado: url,
        categoria
      });
    } catch (error) {
      alert('Erro ao extrair dados do produto.');
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarProduto = () => {
    setProdutos([...produtos, produto]);
    setProduto({
      id: '',
      nome: '',
      slug: '',
      descricao: '',
      categoria: '',
      idade: '',
      genero: '',
      imagem: '',
      linkAfiliado: ''
    });
    setUrl('');
  };

  const copiarJson = () => {
    navigator.clipboard.writeText(JSON.stringify(produtos, null, 2));
    alert('JSON copiado para a área de transferência.');
  };

  const labels: Record<string, string> = {
    id: 'ID',
    nome: 'Nome do Produto',
    slug: 'Slug',
    descricao: 'Descrição',
    categoria: 'Categoria',
    idade: 'Faixa Etária',
    genero: 'Gênero',
    imagem: 'URL da Imagem',
    linkAfiliado: 'Link de Afiliado'
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Cadastro de Produtos Afiliados</h2>
      <input
        type="text"
        placeholder="Cole a URL do produto do Mercado Livre"
        value={url}
        onChange={handleUrlChange}
        style={{ width: '100%', padding: 10 }}
      />
      <button onClick={extrairInfo} style={{ margin: '10px 0' }}>Extrair Informações</button>

      <div style={{ display: 'grid', gap: 10 }}>
        {Object.keys(produto).map((key) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: 4 }}>{labels[key]}</label>
            <input
              type="text"
              name={key}
              value={produto[key as keyof typeof produto]}
              onChange={handleInputChange}
              placeholder={labels[key]}
              style={{ padding: 8 }}
            />
          </div>
        ))}
        <button onClick={adicionarProduto}>Adicionar à Lista</button>
      </div>

      <hr />
      <h3>Lista de Produtos</h3>
      <pre>{JSON.stringify(produtos, null, 2)}</pre>
      <button onClick={copiarJson}>Copiar JSON</button>
    </div>
  );
};

export default App;