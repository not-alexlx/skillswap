import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { useApp } from '../context/AppContext.jsx';
import { timeAgo } from '../utils/matching.js';
import { IconHeart, IconHeartFill, IconComment, IconThumbUp } from './Icons.jsx';

const KIND_LABEL = {
  milestone: 'Milestone',
  looking: 'Looking for help',
  endorsement: 'Endorsement',
  update: 'Update',
};

export default function Post({ post }) {
  const app = useApp();
  const { peerById, user } = app;
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const [showAll, setShowAll] = useState(false);

  const author = post.authorId === 'me' ? user : peerById[post.authorId];
  if (!author) return null;

  const authorName = post.authorId === 'me' ? 'You' : author.name;
  const comments = showAll ? post.comments : post.comments.slice(-2);

  const submitComment = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    app.addComment(post.id, draft);
    setDraft('');
  };

  const goAuthor = () => post.authorId !== 'me' && navigate(`/u/${post.authorId}`);

  return (
    <article className="post">
      <div className="post-head">
        <Avatar person={author} onClick={goAuthor} />
        <div className="grow" onClick={goAuthor} style={{ cursor: post.authorId !== 'me' ? 'pointer' : 'default' }}>
          <div className="name">{authorName}</div>
          <div className="sub">
            {(author.headline || author.school || '').slice(0, 46)} · {timeAgo(post.ts)}
          </div>
        </div>
        <span className={`kind ${post.type}`}>{KIND_LABEL[post.type] || 'Update'}</span>
      </div>

      <div className="post-body">
        {post.type === 'endorsement' ? (
          <span>
            <IconThumbUp size={14} style={{ verticalAlign: '-2px' }} />{' '}
            <b>{authorName}</b> endorsed{' '}
            <b>
              {post.targetId === 'me'
                ? 'you'
                : peerById[post.targetId]?.name || 'a peer'}
            </b>{' '}
            for <b>{post.skill}</b>
          </span>
        ) : (
          post.text
        )}
        {post.skill && post.type !== 'endorsement' && (
          <div>
            <span className="skill-chip">#{post.skill.replace(/\s+/g, '')}</span>
          </div>
        )}
      </div>

      <div className="post-actions">
        <button className={post.likedByMe ? 'liked' : ''} onClick={() => app.toggleLike(post.id)}>
          {post.likedByMe ? <IconHeartFill size={17} /> : <IconHeart size={17} />}
          {post.likes > 0 ? post.likes : 'Like'}
        </button>
        <button onClick={() => setShowAll(true)}>
          <IconComment size={16} />
          {post.comments.length > 0 ? post.comments.length : 'Comment'}
        </button>
      </div>

      {post.comments.length > 0 && (
        <div className="post-comments">
          {!showAll && post.comments.length > 2 && (
            <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={() => setShowAll(true)}>
              View all {post.comments.length} comments
            </button>
          )}
          {comments.map((c) => {
            const ca = c.authorId === 'me' ? user : peerById[c.authorId];
            return (
              <div className="cmt" key={c.id}>
                <b>{c.authorId === 'me' ? 'You' : ca?.name?.split(' ')[0] || 'Someone'}</b> {c.text}
              </div>
            );
          })}
        </div>
      )}

      <form className="cmt-form" onSubmit={submitComment}>
        <input
          placeholder="Add a comment…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="btn sm" disabled={!draft.trim()}>Post</button>
      </form>
    </article>
  );
}
