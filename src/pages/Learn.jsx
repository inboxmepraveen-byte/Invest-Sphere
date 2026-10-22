import { useMemo, useState } from "react";
import { BookOpen, Clock } from "lucide-react";
import { articles, ARTICLE_LEVELS } from "../data/articles";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { CategoryPills } from "../components/FilterBar";
import "./Learn.css";

export default function Learn() {
  const [level, setLevel] = useState("All");
  const [query, setQuery] = useState("");
  const [openArticle, setOpenArticle] = useState(null);

  const filtered = useMemo(() => {
    let list = articles;
    if (level !== "All") list = list.filter((a) => a.level === level);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
    }
    return list;
  }, [level, query]);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Learning Center</h1>
          <p>Build your investing knowledge from the fundamentals through advanced portfolio metrics.</p>
        </div>
      </div>

      <input
        className="input listing-search"
        placeholder="Search articles…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ marginBottom: 18 }}>
        <CategoryPills options={["All", ...ARTICLE_LEVELS]} value={level} onChange={setLevel} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No articles found" description="Try a different search term or level." />
      ) : (
        <div className="grid-cards">
          {filtered.map((article) => (
            <button key={article.id} className="article-card" onClick={() => setOpenArticle(article)}>
              <span className={`badge article-level-${article.level.toLowerCase()}`}>{article.level}</span>
              <div className="article-card-title">{article.title}</div>
              <p className="article-card-summary">{article.summary}</p>
              <div className="article-card-meta">
                <Clock size={12} />
                {article.readTime} min read
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!openArticle} onClose={() => setOpenArticle(null)} title={openArticle?.title} width={560}>
        {openArticle && (
          <>
            <div className="article-modal-meta">
              <span className={`badge article-level-${openArticle.level.toLowerCase()}`}>{openArticle.level}</span>
              <span className="text-muted">{openArticle.readTime} min read</span>
            </div>
            <p className="article-modal-content">{openArticle.content}</p>
          </>
        )}
      </Modal>
    </div>
  );
}
