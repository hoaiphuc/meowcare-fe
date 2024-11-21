
import { format } from 'date-fns';

const DateFormat = (dateString: Date) => {
    return (
        format(new Date(dateString), 'dd/MM/yyyy')
    )
}

export default DateFormat