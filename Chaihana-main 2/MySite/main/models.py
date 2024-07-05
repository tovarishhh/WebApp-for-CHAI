from django.db import models

# Create your models here.
class Menu(models.Model):
    name = models.CharField('Название',max_length=50)
    description = models.TextField('Описание', max_length=200)
    price = models.FloatField('Цена')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Меню'
        verbose_name_plural = 'Меню'
    
class Table(models.Model):
    number = models.CharField('Номер стола',max_length=10)

    def __str__(self):
        return self.number
    
    class Meta:
        verbose_name = 'Стол'
        verbose_name_plural = 'Столы'

class Order(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    dish = models.ForeignKey(Menu,on_delete=models.CASCADE)
    price = models.FloatField()
    count = models.IntegerField('Количество')
    date = models.DateField('Дата публикации')

    def __str__(self):
        return str(f"Стол {self.table}")
    
    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'