const Pagination = ({ currentPage, postsPerPage, totalPosts, paginate }) => {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i)
    }
    return (
        <div>
            <ul className="pagination ">
                {currentPage > 1 ? <li><a onClick={() => paginate(currentPage - 1)} className="page-link" href="#">previous</a></li> : ""}
                {pageNumbers.map((number) => {
                    return (<li key={number} className="page-item">
                        <a onClick={() => paginate(number)} href="#" className="page-link">
                            {number}
                        </a>
                    </li>)
                })}
                {currentPage < pageNumbers.length ? <li><a onClick={() => paginate(currentPage + 1)} className="page-link" href="#">next</a></li> : ""}
            </ul>
        </div>
    );
}