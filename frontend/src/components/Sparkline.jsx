function Sparkline({ data, color = '#2563EB', width = 100, height = 32 }) {
  if (!data || data.length < 2) {
    return <svg width={width} height={height} />
  }

  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const step = width / (data.length - 1)

  const points = data.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })

  const areaPoints = `0,${height} ${points.join(' ')} ${width},${height}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={areaPoints} fill={color} opacity="0.12" stroke="none" />
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default Sparkline
