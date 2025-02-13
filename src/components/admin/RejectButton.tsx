'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RejectButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');

  async function handleReject() {
    try {
      const res = await fetch('/api/admin/posts/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reason }),
      });

      if (!res.ok) {
        throw new Error('Failed to reject post');
      }

      // Refresh the page so we see updated status
      router.refresh();
      setShowModal(false);
      setReason('');
    } catch (error) {
      console.error(error);
      alert('Error declining post');
    }
  }

  return (
    <>
      <button
        style={{
          padding: '0.5rem',
          marginLeft: '0.5rem',
          cursor: 'pointer',
          backgroundColor: 'red',
          color: 'white',
        }}
        onClick={() => setShowModal(true)}
      >
        Reject
      </button>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              margin: '100px auto',
              background: '#fff',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <h2>Reject Post</h2>
            <p>Please provide a reason for declining this post:</p>
            <textarea
              style={{ width: '100%', height: '80px' }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div style={{ marginTop: '1rem' }}>
              <button onClick={handleReject} style={{ marginRight: '0.5rem' }}>
                Submit Reason
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
