export function About() {
  return (
    <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Sobre o Indie Spot</h1>
      <p>Catálogo de jogos independentes desenvolvido em React + TypeScript com integração à API da IGDB.</p>
      <h2>Equipe e Componentes</h2>
      <ul>
        <li><strong>Beckham:</strong> Navbar e Footer</li>
        <li><strong>Letícia:</strong> GameCard e RatingBadge</li>
        <li><strong>Netinho:</strong> SearchBar e GenreFilter</li>
        <li><strong>Grazielly:</strong> GameGrid e FavoriteButton</li>
        <li><strong>Matheus:</strong> LoadingSpinner e EmptyState</li>
      </ul>
    </section>
  );
}
