import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit3, BookOpen, Users, Star, TrendingUp, Zap } from 'lucide-react';
import { getPosts } from '../api/postService';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                // Fetch latest 3 approved posts
                const data = await getPosts({ limit: 3 });
                setRecentPosts(data.posts);
            } catch (error) {
                console.error("Failed to fetch recent posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentPosts();
    }, []);

    return (
        <div className="home-container animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Star size={16} className="hero-badge-icon" />
                        <span>Discover the best content</span>
                    </div>
                    <h1 className="hero-title">
                        Share Your Voice With <span className="text-gradient">The World</span>
                    </h1>
                    <p className="hero-subtitle">
                        Join our community of passionate writers and readers. Discover insightful articles, tutorials, and stories on various topics, or start writing your own journey today.
                    </p>
                    <div className="hero-actions">
                        <Link to="/posts" className="btn btn-primary hero-btn">
                            Explore Articles <ArrowRight size={18} />
                        </Link>
                        {user ? (
                            <Link to="/posts/add" className="btn btn-outline hero-btn">
                                Write a Post <Edit3 size={18} />
                            </Link>
                        ) : (
                            <Link to="/signup" className="btn btn-outline hero-btn">
                                Join Now <Users size={18} />
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="hero-decoration dec-1"></div>
                <div className="hero-decoration dec-2"></div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-heading text-center">
                    <h2>Why Choose BlogManager?</h2>
                    <p>Everything you need to read, write, and manage your content seamlessly.</p>
                </div>
                
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper feature-blue">
                            <BookOpen size={24} />
                        </div>
                        <h3>Rich Content</h3>
                        <p>Enjoy beautifully formatted articles across diverse categories. Find exactly what you're looking for with our powerful search.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper feature-purple">
                            <Edit3 size={24} />
                        </div>
                        <h3>Easy Publishing</h3>
                        <p>Our intuitive editor makes writing a breeze. Draft, preview, and publish your thoughts in minutes without any technical hassle.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper feature-green">
                            <TrendingUp size={24} />
                        </div>
                        <h3>Grow Your Audience</h3>
                        <p>Reach thousands of readers instantly. Share your insights, get featured, and establish yourself as an authority in your niche.</p>
                    </div>
                </div>
            </section>

            {/* Recent Posts Section */}
            <section className="recent-posts-section">
                <div className="section-heading">
                    <h2><Zap size={24} className="heading-icon text-yellow" /> Latest Articles</h2>
                    <Link to="/posts" className="view-all-link">View all <ArrowRight size={16} /></Link>
                </div>

                {loading ? (
                    <div className="home-loading">Loading recent posts...</div>
                ) : (
                    <div className="recent-posts-grid">
                        {recentPosts.length > 0 ? recentPosts.map(post => (
                            <Link to={`/posts/view/${post._id}`} key={post._id} className="recent-post-card">
                                <div className="recent-post-image">
                                    <img src={post.thumbnailUrl} alt={post.title} />
                                    <span className="recent-post-category">{post.category}</span>
                                </div>
                                <div className="recent-post-content">
                                    <h3 className="recent-post-title">{post.title}</h3>
                                    <p className="recent-post-desc">{post.shortDescription}</p>
                                    <div className="recent-post-meta">
                                        <div className="recent-post-author">
                                            <div className="author-avatar">
                                                {post.authorName.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{post.authorName}</span>
                                        </div>
                                        <span className="recent-post-date">{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="no-posts-found">No articles published yet. Check back soon!</div>
                        )}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="cta-section">
                    <div className="cta-content">
                        <h2>Ready to share your insights?</h2>
                        <p>Create an account today and join thousands of writers who are making an impact.</p>
                        <Link to="/signup" className="btn btn-primary cta-btn">Get Started for Free</Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
