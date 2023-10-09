
//<FilterButtonHolder filters={availableFilters} setTagFilter = {setTagFilter}/>
export function FilterButtonHolder(props) {

    const handleFilterButton = (e) => { 
        const filterName = e.target.id
        console.log('are we running?')
        props.setTagFilter((prevState) => {
            return (new Set([filterName, ...prevState]))
        })
    }

    const logFoo = (e) => {
        console.log('foobar')
    }

    const filtersArray =  [...props.filters]
    const FilterButtons = filtersArray.map((filterTag) => (
        <button onClick={handleFilterButton} className = 'bg-red-300' key = {filterTag} id = {filterTag}>{filterTag}</button>
    ))// need to troubleshoot button onClick not working - not running at all - also refactor the buttons later

     //(e)=>{handleFilterButton(e)}

    return (
    <div className = 'flex justify-center'>
    <br />
    <br />
        {FilterButtons}

    </div>
    )
}