import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/tickets/${id}`)
      .then(res => {
        setTicket(res.data);
        setComments(res.data.comments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios.post(`http://localhost:8080/api/v1/tickets/${id}/comments`, {
        content: newComment,
        author: "Student123"
    })
    .then(res => {
        setComments(res.data.comments || []);
        setNewComment("");
    })
    .catch(err => alert("Error adding comment"));
  };

  if (loading) return <p>Loading ticket details...</p>;
  if (!ticket) return <p>Ticket not found</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px' }}>
      <Link to="/tickets" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '15px', display: 'inline-block' }}>
        ← Back to List
      </Link>

      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h2>{ticket.title}</h2>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Status:</strong> <span style={{background: '#eee', padding: '2px 6px', borderRadius: '4px'}}>{ticket.status}</span></p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
      </div>

      <h3 style={{ marginTop: '30px' }}>💬 Comments</h3>
      
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
        {comments.length === 0 ? <p>No comments yet.</p> : 
          comments.map((c, index) => (
            <div key={index} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
              <strong>{c.author}</strong> <span style={{fontSize: '10px', color: '#888'}}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
              <p style={{ margin: '5px 0 0 0' }}>{c.content}</p>
            </div>
          ))
        }
      </div>

      <form onSubmit={handleAddComment}>
        <textarea 
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{ width: '100%', height: '80px', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Post Comment
        </button>
      </form>
    </div>
  );
}

export default TicketDetail;