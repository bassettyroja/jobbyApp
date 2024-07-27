import {BsSearch} from 'react-icons/bs'
import profileDetails from '../profileDetails'
import './index.css'

const FiltersGroup = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event)
  }

  const onEnterSearchInput = event => {
    const {geJobs} = props
    if (event.key === 'enter') {
      getJobs()
    }
  }

  renderSearchInput = () => {
    const {getJobs, searchInput} = props

    return (
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
          value={searchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button type="button" className="search-input" onClick={getJobs}>
          <BsSearch size={25} />
        </button>
      </div>
    )
  }

  renderTypesOfEmploymentList = () => {
    const {employmentTypesList} = props

    return (
      <div className="employment-container">
        <h1 className="employment-heading">types of Employment</h1>
      </div>
    )
  }
}
