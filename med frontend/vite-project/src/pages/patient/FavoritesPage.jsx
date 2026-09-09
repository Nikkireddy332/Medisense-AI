import React, { useState, useEffect } from 'react';
import { FaHeart, FaHospital, FaUserMd, FaFlask, FaPills, FaTrash, FaGlobe, FaPhoneAlt } from 'react-icons/fa';
import { ecosystemService } from '../../api';
import { toast } from 'react-toastify';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await ecosystemService.getFavorites();
      if (res?.success) {
        setFavorites(res.favorites || []);
      }
    } catch (err) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemType, itemId) => {
    try {
      await ecosystemService.removeFavorite(itemType, itemId);
      setFavorites(prev => prev.filter(f => !(f.itemType === itemType && f.itemId === itemId)));
      toast.info('Item removed from saved favorites');
    } catch (err) {
      toast.error('Failed to remove favorite');
    }
  };

  return (
    <div className="favorites-page pb-5">
      <div className="bg-gradient-primary text-white rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
        <h2 className="fw-bold mb-2 d-flex align-items-center gap-2">
          <FaHeart className="text-danger" /> Saved Favorites
        </h2>
        <p className="lead opacity-90 mb-0">
          Your bookmarked hospitals, specialist doctors, diagnostic laboratories, and pharmacies.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading your saved favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-5 card border-0 shadow-sm glass-card rounded-4 p-5">
          <FaHeart className="display-3 text-muted mb-3" />
          <h4 className="fw-bold text-dark">No Saved Favorites Yet</h4>
          <p className="text-muted">Click the heart icon on any hospital, doctor, or lab card to save it for quick access.</p>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map(fav => (
            <div key={fav._id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm glass-card rounded-4 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary text-capitalize rounded-pill px-3 py-1">
                      {fav.itemType}
                    </span>
                    <button 
                      onClick={() => handleRemove(fav.itemType, fav.itemId)}
                      className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                      title="Remove Favorite"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{fav.name}</h5>
                  <p className="text-muted small mb-2">{fav.details?.address || 'Saved Address N/A'}</p>
                </div>

                <div className="pt-3 border-top d-flex gap-2">
                  {fav.details?.website && (
                    <a href={fav.details.website} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                      <FaGlobe /> Website
                    </a>
                  )}
                  {fav.details?.phone && (
                    <a href={`tel:${fav.details.phone}`} className="btn btn-light btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                      <FaPhoneAlt /> Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
