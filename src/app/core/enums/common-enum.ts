export enum CommonEnum{
    Domestic = 'Domestic',
    International = 'International',
    BatchNo = 'BatchNo',
    SerialNo = 'SerialNo',
    All = 'All',
    None = 'None'
}

export enum RegexEnum{
    //GSTNumberRegex='^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
    GSTNumberRegex='^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz]{1}[0-9A-Za-z]{1}$',
    PANNumberRegex='^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
    EmailRegex='^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
    MobileNumberRegex='^[0-9]{10}$'
}