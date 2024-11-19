export function Prayers({image, prayer, time}) {
    return (
        <div className="card">
            <img src={image} alt="Mosque" />

            <h1>{prayer}</h1>

            <hr/>

            <h3>{time}</h3>
        </div>
    )
};