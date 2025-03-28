# Buscador de Fondos de Inversión

Una aplicación web moderna para buscar y filtrar fondos de inversión. Permite a los usuarios explorar una amplia base de datos de fondos, comparar sus características y rendimientos.

## Características

- 🔍 **Búsqueda Avanzada**: Filtrado por ISIN, nombre y categoría
- 📊 **Visualización de Datos**:
  - Rentabilidad (2025, 1 año, 3 años, 5 años)
  - Nivel de riesgo
  - Comisiones totales (TER)
  - Rating Morningstar
  - Inversión mínima
- 📱 **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos
- 🎯 **Paginación**: Navegación eficiente por grandes conjuntos de datos
- ⚡ **Rendimiento Optimizado**: Carga y filtrado eficiente de datos

## Tecnologías Utilizadas

- [Next.js](https://nextjs.org/) - Framework de React
- [TanStack Table](https://tanstack.com/table) - Gestión de tablas y datos
- [Tailwind CSS](https://tailwindcss.com/) - Estilos y diseño
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/buscador-fondos.git
```

2. Instala las dependencias:
```bash
cd buscador-fondos
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
buscador-fondos/
├── src/
│   ├── app/
│   │   └── page.tsx           # Página principal
│   ├── components/
│   │   └── FundTable.tsx      # Componente de tabla de fondos
│   └── types/
│       └── index.ts           # Definiciones de tipos
├── public/
│   └── datos-fondos.csv       # Datos de los fondos
└── package.json
```

## Uso

1. **Búsqueda de Fondos**:
   - Utiliza el campo de búsqueda para filtrar por ISIN o nombre
   - Selecciona categorías específicas usando los filtros laterales

2. **Visualización**:
   - Ajusta el número de fondos mostrados por página
   - Navega entre páginas usando los controles de paginación
   - Ordena los fondos haciendo clic en los encabezados de columna

3. **Detalles del Fondo**:
   - Visualiza información detallada de cada fondo
   - Compara rentabilidades y comisiones
   - Revisa el rating Morningstar y la inversión mínima

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter)

Link del Proyecto: [https://github.com/tu-usuario/buscador-fondos](https://github.com/tu-usuario/buscador-fondos) #   b u s c a d o r - f o n d o s  
 