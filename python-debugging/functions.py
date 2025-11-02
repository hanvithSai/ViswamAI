def find_average(numbers):
    total = 0
    for num in numbers:
        total += num
    # if len (numbers) == 0:
    #     return 0
    average = total / len(numbers)
    return average

# Buggy input: empty list
data = []
result = find_average(data)
print("Average is:", result)

