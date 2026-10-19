import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', name: '', mobile: '', active: 'ACTIVE' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axios.post('/auth/register', {
        username: formData.email,
        password: formData.password,
        name: formData.name,
        mobile: Number(formData.mobile),
        active: formData.active,
      })
      navigate('/login', { state: { signupSuccess: true } })
    } catch (err) {
      console.log(err.response)
      setError(err.response?.data?.message || 'Unable to create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="simple-login-page">
      <section className="simple-login-card">
        <Link to="/" className="brand simple-login-brand" aria-label="LeaveFlow home">
          <span className="brand-symbol"><i /><i /><i /></span>
          <span>leaveflow<span className="brand-period">.</span></span>
        </Link>
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" autoComplete="email" required />
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" required />
          <label htmlFor="signup-name">Name</label>
          <input id="signup-name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Enter your name" autoComplete="name" required />
          <label htmlFor="signup-mobile">Mobile</label>
          <input id="signup-mobile" name="mobile" type="tel" inputMode="numeric" value={formData.mobile} onChange={handleChange} placeholder="Enter your mobile number" autoComplete="tel" required />
          <label htmlFor="signup-active">Active</label>
          <select id="signup-active" name="active" value={formData.active} onChange={handleChange} required>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DEACTIVE">DEACTIVE</option>
          </select>
          {error && <p className="signup-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Sign up'}</button>
        </form>
        <p className="signup-login-link">Already have an account? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  )
}

export default SignupPage
