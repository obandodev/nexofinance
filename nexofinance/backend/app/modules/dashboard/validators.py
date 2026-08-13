def validate_month(month: str):
    if len(month) != 7 or month[4] != '-':
        raise ValueError('El mes debe tener formato YYYY-MM')
