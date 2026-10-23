function WelcomeSplash() {
  return (
    <main aria-label="Unisys Training" className="welcome-splash" role="status">
      <div aria-hidden="true" className="welcome-glow" />
      <div aria-hidden="true" className="welcome-particles">
        {Array.from({ length: 22 }, (_, index) => (
          <span
            className="welcome-particle"
            key={index}
            style={{
              '--particle-size': `${(index % 4) + 1}px`,
              '--particle-left': `${(index * 47) % 100}%`,
              '--particle-bottom': `${(index * 31) % 30}%`,
              '--particle-duration': `${5 + ((index * 29) % 60) / 10}s`,
              '--particle-delay': `${((index * 73) % 60) / 10}s`,
              '--particle-color': index % 3 === 0 ? '#007173' : '#00E28B',
            }}
          />
        ))}
      </div>

      <div className="welcome-stage">
        <div aria-label="Unisys" className="welcome-wordmark">
          {'unisys'.split('').map((letter, index) => (
            <span className="welcome-letter" key={`${letter}-${index}`}>
              {letter}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="welcome-line-wrap">
          <div className="welcome-accent-line" />
          <div className="welcome-line-spark" />
        </div>
        <div className="welcome-training-wrap">
          <div className="welcome-training">
            <span aria-hidden="true" className="welcome-training-bar" />
            <span className="welcome-training-text">training</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WelcomeSplash;
